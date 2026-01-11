import { supabase } from '../lib/supabase';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: any;
}

export class NotificationService {
  static async create(payload: NotificationPayload): Promise<void> {
    try {
      const { error } = await supabase.rpc('create_notification', {
        p_user_id: payload.userId,
        p_type: payload.type,
        p_title: payload.title,
        p_message: payload.message,
        p_link: payload.link || null,
        p_metadata: payload.metadata || {},
      });

      if (error) {
        console.error('Failed to create notification:', error);
      }
    } catch (err) {
      console.error('Notification service error:', err);
    }
  }

  static async notifyApplicationStatusChange(
    volunteerId: string,
    projectTitle: string,
    status: 'approved' | 'rejected'
  ): Promise<void> {
    await this.create({
      userId: volunteerId,
      type: status === 'approved' ? 'success' : 'info',
      title: `Application ${status}`,
      message: `Your application for "${projectTitle}" has been ${status}.`,
      link: '/volunteer-dashboard',
    });
  }

  static async notifyNewApplication(
    corporateId: string,
    projectTitle: string,
    volunteerName: string
  ): Promise<void> {
    await this.create({
      userId: corporateId,
      type: 'info',
      title: 'New Volunteer Application',
      message: `${volunteerName} applied to "${projectTitle}".`,
      link: '/corporate-dashboard/projects',
    });
  }

  static async notifyProjectUpdate(
    volunteerId: string,
    projectTitle: string,
    updateType: string
  ): Promise<void> {
    await this.create({
      userId: volunteerId,
      type: 'info',
      title: 'Project Update',
      message: `"${projectTitle}" has a new update: ${updateType}.`,
      link: '/volunteer-dashboard',
    });
  }

  static async notifyPaymentApproval(
    requesterId: string,
    amount: number,
    status: 'approved' | 'rejected'
  ): Promise<void> {
    await this.create({
      userId: requesterId,
      type: status === 'approved' ? 'success' : 'warning',
      title: `Payment ${status}`,
      message: `Your payment request for PKR ${amount.toLocaleString()} has been ${status}.`,
      link: '/corporate-dashboard/payments',
    });
  }

  static async notifyVettingAssignment(
    assigneeId: string,
    entityType: string,
    entityName: string
  ): Promise<void> {
    await this.create({
      userId: assigneeId,
      type: 'info',
      title: 'New Vetting Assignment',
      message: `You've been assigned to review ${entityType}: ${entityName}.`,
      link: '/admin/vetting-queue',
    });
  }

  static async notifyVettingDecision(
    submitterId: string,
    entityType: string,
    status: 'approved' | 'rejected'
  ): Promise<void> {
    await this.create({
      userId: submitterId,
      type: status === 'approved' ? 'success' : 'warning',
      title: `${entityType} ${status}`,
      message: `Your ${entityType} has been ${status}.`,
    });
  }

  static async notifyMilestoneComplete(
    corporateId: string,
    projectTitle: string,
    milestoneTitle: string
  ): Promise<void> {
    await this.create({
      userId: corporateId,
      type: 'success',
      title: 'Milestone Completed',
      message: `Milestone "${milestoneTitle}" in "${projectTitle}" has been completed.`,
      link: '/corporate-dashboard/projects',
    });
  }

  static async notifyHoursApproved(
    volunteerId: string,
    hours: number,
    projectTitle: string
  ): Promise<void> {
    await this.create({
      userId: volunteerId,
      type: 'success',
      title: 'Hours Approved',
      message: `${hours} volunteer hours for "${projectTitle}" have been approved.`,
      link: '/volunteer-dashboard/hours',
    });
  }

  static async notifyDocumentVerified(
    ngoId: string,
    documentType: string,
    verified: boolean
  ): Promise<void> {
    await this.create({
      userId: ngoId,
      type: verified ? 'success' : 'warning',
      title: `Document ${verified ? 'Verified' : 'Rejected'}`,
      message: `Your ${documentType} document has been ${verified ? 'verified' : 'rejected'}.`,
      link: '/ngo-dashboard/documents',
    });
  }

  static async notifyBudgetThreshold(
    corporateId: string,
    projectTitle: string,
    percentageUsed: number
  ): Promise<void> {
    await this.create({
      userId: corporateId,
      type: 'warning',
      title: 'Budget Alert',
      message: `"${projectTitle}" has used ${percentageUsed}% of its budget.`,
      link: '/corporate-dashboard/projects',
    });
  }

  static async notifyNGOVerified(ngoId: string, ngoName: string): Promise<void> {
    await this.create({
      userId: ngoId,
      type: 'success',
      title: 'NGO Verified',
      message: `Congratulations! ${ngoName} has been verified.`,
      link: '/ngo-dashboard',
    });
  }

  static async notifyCertificateIssued(
    volunteerId: string,
    projectTitle: string,
    certificateNumber: string
  ): Promise<void> {
    await this.create({
      userId: volunteerId,
      type: 'success',
      title: 'Certificate Issued',
      message: `You've earned a certificate for "${projectTitle}". Certificate #${certificateNumber}`,
      link: '/volunteer-dashboard/certificates',
    });
  }
}
