import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertService } from '../alert/alert-service/alert.service';
import { ApiService } from '../api.service';
import { Login } from '../Libs/Login';
import { SaveOffline } from '../Libs/SaveOffiline';
import { SaveOnline } from '../Libs/SaveOnline';

/**
 * For Handling Time ie. Prevent moment error
 */
declare var moment;

/**
 * Class for Dashboard page
 */
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  /**
   * List of Offline Circuits
   */
  items: any[] = [];
  /**
   * Selected Circuit required for popup
   */
  selected: any = {};
  /**
   * List of Online Circuits
   */
  online: any[] = [];

  /**
   * List of Search circuit name
   */
  circuitFilter: any = { name: '' };

  /**
   * Message shown to user if something happens while fetching online circuits
   */
  onCloudMessage = 'No Online Circuits Available  &#9785;';
  /**
   * Variable to tell if it is production build
   */
  isProd = environment.production;
  /**
   * Close Project Properties dialog
   */

  /**
   * Group role of dashboard component
   */
  groupRole = [];

  /**
   * Token
   */
  token;

  /**
   * visible cloud circuit
   */
  isCloudCircuit = true;
  /**
   * visible temp circuit
   */
  isTempCircuit = false;
  /**
   * show LTI App circuit tab or not
   */
  isLTIApp = false;
  /**
   * show LTI Submissions circuit tab or not
   */
  isLTISub = false;


  /**
   * Username  of register user.
   */
  username = '';
  /**
   * Search text of search box
   */
  // searchText = '';

  // configuration for side nav.
  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = true;
  showSubmenu = false;
  isShowing = false;
  showSubSubMenu = false;
  /**
   * Determines whether cloud side menu click
   */
  onCloudClick() {
    this.isTempCircuit = false;
    this.isCloudCircuit = true;
    this.isLTIApp = false;
    this.isLTISub = false;
  }
  /**
   * Determines whether temp circuit click
   */
  onTempCircuitClick() {
    this.isTempCircuit = true;
    this.isCloudCircuit = false;
    this.isLTIApp = false;
    this.isLTISub = false;
  }
  /**
   * Determines whether LTI App click
   */
  onLTIAppsClick() {
    this.isTempCircuit = false;
    this.isCloudCircuit = false;
    this.isLTIApp = true;
    this.isLTISub = false;
  }
  /**
   * Determines whether temp circuit click
   */
  onLTISubmissionsClick() {
    this.isTempCircuit = false;
    this.isCloudCircuit = false;
    this.isLTIApp = false;
    this.isLTISub = true;
  }

  getInitials(nameString, i) {
    const fullName = nameString.split(' ');
    const initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
    return initials.toUpperCase();
  }

  closeProject() {
    document.documentElement.style.overflow = 'auto';
    const closeProject = document.getElementById('openproject');
    closeProject.style.display = 'none';
  }
  /**
   * Open Project in the simulator
   * @param id Project Id
   * @param offline Is Offline circuit boolean
   */
  openProject(id, offline = false) {
    // Select the clicked item
    if (offline) {
      this.selected = this.items[id];
    } else {
      this.selected = this.online[id];
    }
    this.selected.index = id;
    // Show Project Properties Dialog
    document.documentElement.style.overflow = 'hidden';
    const openProject = document.getElementById('openproject');
    openProject.style.display = 'block';
  }
  /**
   * Constructor for Dashboard page
   * @param api API Service
   * @param snackbar Material Snackbar
   * @param title Document Title
   */
  constructor(
    private api: ApiService,
    private snackbar: MatSnackBar,
    private title: Title,
    private alertService: AlertService,
    private router: Router,
    private aroute: ActivatedRoute
  ) {
    this.title.setTitle('Dashboard | Arduino On Cloud');
  }
  /**
   * On Init Dashboard Page
   */
  ngOnInit() {
    // In Angular  Development Mode.
    this.api.login().then(() => {
      this.token = Login.getToken();
      this.userInfo(this.token);
      this.readRoles(this.token);
      this.readTempItems();
      this.readOnCloudItems();
    });
    this.checkUrl();
  }

  /**
   * Checks url if the user click on other tabs
   */
  checkUrl() {
    this.aroute.params.subscribe((params: any) => {
      if (params.id === 'temp') {
        this.isTempCircuit = true;
        this.isCloudCircuit = false;
        this.isLTIApp = false;
        this.isLTISub = false;
      } else if (params.id === 'ltiapp') {
        this.onLTIAppsClick();
      } else if (params.id === 'ltisub') {
        this.onLTISubmissionsClick();
      } else {
        this.isTempCircuit = false;
        this.isCloudCircuit = true;
        this.isLTIApp = false;
        this.isLTISub = false;
      }
    });
  }
  /**
   * Getting User Information.
   */
  userInfo(token) {

    // If token is available then get username
    if (token) {
      this.api.userInfo(token).subscribe((v) => {
        this.username = v.username;
      }, (err) => {
        // console.log(err.status)
        console.log(err);
        // if (err.status === 401) {
        Login.logout();
        // }
      });
    }
  }
  /**
   * Reads roles
   */
  readRoles(token: string) {
    this.api.getRole(token).subscribe((result: any) => {
      this.groupRole = result.group;
    }, (e) => {
      console.log(e);
    });
  }

  /**
   * Read the online saved circuits.
   */
  readOnCloudItems() {
    // this.searchText = '';
    // Get Login token
    const token = Login.getToken();
    // if token is present get the list of project created by a user
    if (token) {
      this.api.listProject(token).subscribe((val: any[]) => {
        this.online = this.filterOnlineProjects(val);
        this.online.forEach((circuit, index) => {
          circuit.index = index;
        });
      }, err => console.log(err));
    } else {
      // if no token is present then show this message
      this.onCloudMessage = 'Please Login to See Circuit';
    }
  }

  /**
   * Filter projects: Pick only 1 variation of a project
   * @param val All projects in cloud
   * @returns filtered list of projects
   */
  filterOnlineProjects(val) {
    const projects = [];
    const added = [];
    for (const e in val) {
      if (!added.includes(val[e].save_id)) {
        added.push(val[e].save_id);
        projects.push(val[e]);
      }
    }
    return projects;
  }

  /**
   * Read the Database for temporarily saved circuits.
   */
  readTempItems() {
    // Read All Offline Project
    SaveOffline.ReadALL((v: any[]) => {
      // Map Offline Project to standard card item
      this.items = v.map(item => {
        return {
          name: item.project.name,
          description: item.project.description,
          create_time: item.project.created_at,
          save_time: item.project.updated_at,
          base64_image: item.project.image,
          save_id: item.id,
          offline: true
        };
      });
    });
  }

  /**
   * Function to call when user confirms the ciruit deletion
   * @param id Project id
   * @param offline Is Offline Circuit
   * @param index Project's index in their list
   */
  private deleteCircuitConfirm(id, offline, index) {
    // Show loading animation
    window['showLoading']();

    // if project is offline delete from indexDB
    if (offline) {
      SaveOffline.Delete(id, () => {
        this.items.splice(index, 1);
        this.closeProject();
        AlertService.showAlert('Done Deleting');
        window['hideLoading']();
      });
    } else {
      // Delete Project from cloud
      const token = Login.getToken();
      this.api.deleteProject(id, token).subscribe((out) => {
        if (out.status === 204 || out.done) {
          // Remove From the list
          this.online.splice(index, 1);
        } else {
          AlertService.showAlert('Something went wrong');
        }
        this.closeProject();
        window['hideLoading']();
      }, err => {
        AlertService.showAlert('Something went wrong');
        window['hideLoading']();
        console.log(err);
      });
    }
  }

  /**
   * Delete the Project from Database
   * @param id Project id
   * @param offline Is Offline Circuit
   * @param index Project's index in their list
   */
  DeleteCircuit(id, offline, index) {
    // ASK for user confirmation
    AlertService.showConfirm('Are You Sure You want to Delete Circuit', () => this.deleteCircuitConfirm(id, offline, index));
  }

  /**
   * Disanle Project Sharing
   * @param item Project Card Object
   */
  DisableSharing(item: any) {
    const token = Login.getToken();
    this.EnableSharing(item, token, (v) => {
      item.shared = v.shared;
      AlertService.showAlert('Sharing Disabled!');
    }, false);
  }
  /**
   * Returns a time difference from now in a string
   * @param item Project card Object
   * @param time Project time (create/update)
   */
  DateDiff(item: any, time) {
    item.time = moment(time).fromNow();
  }
  /**
   * Returns complete date in meaningfull format
   * @param item Project Card Object
   */
  ExpandDate(item) {
    item.create = moment(item.create_time).format('LLLL');
    item.edit = moment(item.save_time).format('LLLL');
  }

  /**
   * Copy respective url to clipboard for sharing
   * @param url URL that need to be copy
   */
  CopyUrlToClipBoard(url) {
    // Select the html textarea element and put url inside it
    const tmpEl: HTMLTextAreaElement = document.querySelector('#sharing-url');
    tmpEl.value = url;
    // Focus and Select the element
    tmpEl.focus();
    tmpEl.select();
    // exec copy command
    const done = document.execCommand('copy');
    // if not able to copy show alert with url else show user a snackbar
    if (!done) {
      AlertService.showAlert('Not able to Copy ' + tmpEl.value);
    } else {
      this.snackbar.open('Copied', null, {
        duration: 2000
      });
    }
  }
  /**
   * Project to enable or disable sharing (default enable)
   * @param id Project id
   * @param token Auth Token
   * @param callback Callback when done
   * @param enable Enable/Disable sharing
   */
  EnableSharing(circuit, token, callback: any, enable: boolean = true) {
    this.api.Sharing(circuit.save_id, circuit.branch, circuit.version, enable, token).subscribe((v) => {
      callback(v);
    }, err => {
      if (err.status === 401) {
        console.log('You are not the Owner');
        return;
      }
      console.log(err);
    });
  }
  /**
   * Share Project button click event handler
   * @param selected Selected Project Card Object
   * @param index Type of Sharing
   */
  ShareCircuit(selected, index) {
    /**
     * index
     * 0 -> FB
     * 1 -> LinkedIN
     * 2 -> Reddit
     * 3 -> Mail
     * 4 -> copy url
     */

    // Get token if logged in
    const token = Login.getToken();
    if (!token) {
      AlertService.showAlert('Please Login');
      return;
    }


    this.snackbar.open('Anyone With The Link Can View and Simulate Project But cannot edit.', 'Close', {
      duration: 10000
    });
    // Create a Slug
    let slug = `${selected.save_id.replace(/-/g, '_')}-${selected.branch.replace(/-/g, '_')}-${selected.version.replace(/-/g, '_')}`;
    slug += `-${selected.name.substr(0, 50).replace(/ +/g, '-')}`;
    // redirect to share url
    let shareURL = `${window.location.protocol}\\\\${window.location.host}/arduino/#/project/${slug}`;
    const copyUrl = shareURL;
    // encode url for redirect
    shareURL = encodeURIComponent(shareURL);
    // Sharing title
    const sharingName = encodeURIComponent(`${selected.name} | Arduino On Cloud`);

    if (index < 3) {
      // Map of sharing url of each website
      const map = [
        `https://www.facebook.com/sharer/sharer.php?u=${shareURL}`,
        `https://www.linkedin.com/sharing/share-offsite/?url=${shareURL}`,
        `http://www.reddit.com/submit?url=${shareURL}&title=${sharingName}`
      ];
      // if project is already shared then open link
      if (selected.shared) {
        window.open(map[index], '_blank');
      } else {
        // otherwise enable sharing and open the link in new tab
        this.EnableSharing(selected, token, (v) => {
          selected.shared = v.shared;
          if (selected.shared) {
            window.open(map[index], '_blank');
          } else {
            AlertService.showAlert('Not Able to Share Circuit');
          }
        });
      }
    } else if (index === 3) {
      // Send email
      const description = encodeURI(`${selected.description}\n\n\n\n\nVisit `);
      const back = `subject=${sharingName}&body=${description}${shareURL}`;
      if (selected.shared) {
        window.open(`mailto:?${back}`, '_blank');
      } else {
        this.EnableSharing(selected, token, (v) => {
          selected.shared = v.shared;
          if (selected.shared) {
            window.open(`mailto:?${back}`, '_blank');
          } else {
            AlertService.showAlert('Not Able to Share Circuit');
          }
        });
      }
    } else if (index === 4) {
      // Copy sharing url to clipboard if sharing is on
      if (selected.shared) {
        this.CopyUrlToClipBoard(copyUrl);
      } else {
        // other wise enable share and copy the url
        this.EnableSharing(selected, token, (v) => {
          selected.shared = v.shared;
          if (selected.shared) {
            this.CopyUrlToClipBoard(copyUrl);
          } else {
            AlertService.showAlert('Not Able to Share Circuit');
          }
        });
      }
    }
  }

  /**
   * Import the circuit in json format
   * @param event Context of event
   */
  ImportCircuit(event) {
    const file: File = event.target.files[0];
    let fileData;

    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = async () => {
        fileData = reader.result;
        fileData = await JSON.parse(fileData);
        this.SaveCircuit(fileData);
        document.getElementById('importFileBTN')['value'] = null;
      };
    }
  }

  /**
   * Export the circuit in json format
   * @param selected selected Project
   * @param offline Is Offline Circuit
   */
  ExportCircuit(selected, offline) {
    let id = selected.save_id;
    if (offline) {
      if (typeof id !== 'number') {
        id = Date.now();
      }
      SaveOffline.Read(id, this.DownloadFile);
    } else {
      const token = Login.getToken();
      if (!token) {
        AlertService.showAlert('Please Login');
        return;
      }
      this.api.readProject(id, selected.branch, selected.version, token).subscribe(
        data => {
          // Converting data to required format
          const obj = JSON.parse(data['data_dump']);
          const project = {
            name: data['name'],
            description: data['description'],
            image: data['base64_image'],
            created_at: data['create_time'],
          };
          obj['id'] = id;
          obj['project'] = project;
          // Getting image data from image url
          const image = document.createElement('img');
          image.setAttribute('src', project.image);
          image.setAttribute('visibility', 'hidden');
          image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
            obj.project.image = canvas.toDataURL();
            this.DownloadFile(obj);
            image.parentElement.removeChild(image);
            canvas.parentElement.removeChild(canvas);
          };
        },
        (err: HttpErrorResponse) => {
          if (err.status === 401) {
            AlertService.showAlert('You are Not Authorized to download this circuit');
            window.open('../../../', '_self');
            return;
          }
          AlertService.showAlert('Something Went Wrong');
          console.log(err);
        }
      );
    }
  }

  /**
   * Creates virtual DOM element to download the content
   * @param data Data in JSON format with meta details like id, project info
   */
  DownloadFile(data) {
    const filename = (data.project.name ? data.project.name : 'Undefined') + '.json';
    const fileJSON = JSON.stringify(data);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileJSON));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /**
   * Save the circuit in the database
   * @param fileData JSON Object of the circuit
   */
  SaveCircuit(fileData) {
    AlertService.showOptions('Where do you want to save it?', () => {
      if (!(Login.getToken())) {
        AlertService.showAlert('Please login! Before Login Save the Project Temporary.');
        return;
      }
      // If project id is uuid (online circuit) then accordingly save or update
      SaveOnline.SaveFromDashboard(fileData, this.api, (_) => {
        this.readOnCloudItems();
      }, SaveOnline.isUUID(fileData.id));
    },
      () => {
        if (!(fileData.id) || typeof fileData.id !== 'number') {
          fileData.id = Date.now();
          SaveOffline.Save(fileData, (_) => {
            this.readTempItems();
          });
        } else {
          SaveOffline.Read(fileData.id, (data) => {
            if (data) {
              SaveOffline.Update(fileData, (_) => {
                this.readTempItems();
              });
            } else {
              SaveOffline.Save(fileData, (_) => {
                this.readTempItems();
              });
            }
          });
        }
      },
      () => { }, 'On the Cloud', 'Temporarily in the browser', 'Cancel');
  }

  /**
   * Get Url for sharing circuits
   * @param circuit Object containing data of the circuit opened
   * @returns url string for sharing circuits
   */
  getUrl(circuit) {
    let slug = `${circuit.save_id.replace(/-/g, '_')}-${circuit.branch.replace(/-/g, '_')}-${circuit.version.replace(/-/g, '_')}`;
    slug += `-${circuit.name.substr(0, 50).replace(/ +/g, '-')}`;
    // redirect to share url
    return `${window.location.protocol}\\\\${window.location.host}/arduino/#/project/${slug}`;
  }

  /**
   * Deletes the LTI App created for the selected circuit.
   * @param selected Data of the circuit selected from dashboard
   */
  DeleteLTI(selected) {
    const token = Login.getToken();
    if (token) {
      AlertService.showConfirm('Are You Sure You want to Delete LTI App', () => {
        this.api.removeLTIDetails(selected.id, token).subscribe(_ => {
          selected.lti_id = null;
          AlertService.showAlert('Deleted LTI App successfully');
          this.readOnCloudItems();
        }, err => {
          AlertService.showAlert('Something went wrong');
          console.log(err);
        });
      });
    }
  }

  /**
   * Filter Circuits if they don't have LTI App or are not submissions
   * @returns Filtered array of circuits containing lti_id = null and is_submission = false
   */
  getNormalCircuits() {
    return this.online.filter(i => !i.lti_id && !i.is_submission );
  }

  /**
   * Filter Circuits if they have LTI App
   * @returns Filtered array of circuits containing lti_id
   */
  getLTIApps() {
    return this.online.filter(circuit => circuit.lti_id);
  }

  /**
   * Filter Circuits if they are LTI Submissions
   * @returns Filtered array of circuits containing is_submission
   */
  getLTISubmissions() {
    return this.online.filter(circuit => circuit.is_submission);
  }
}
